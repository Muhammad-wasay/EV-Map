import unittest
from src.corridor_bridge import CorridorBridge
from src.dp_charger import DPChargingOptimizer
from src.api_client import VoltPathAPIClient
from src.astar_router import AStarRouter
from src.preprocessor import NetworkPreprocessor


class TestDPChargingOptimizer(unittest.TestCase):
    def setUp(self):
        client = VoltPathAPIClient()
        self.nodes, self.edges, self.ev, _ = client.load_network_and_ev()
        adj, _ = NetworkPreprocessor.build_active_adjacency_list(self.nodes, self.edges)
        self.path_nodes, self.path_edges, _ = AStarRouter.find_optimal_route(
            self.nodes, adj, "N01", "N14"
        )
        self.segments, _ = CorridorBridge.extract_corridor(
            self.nodes, self.path_nodes, self.path_edges, self.ev
        )
        self.corridor_nodes = [self.nodes[nid] for nid in self.path_nodes]

    def test_dp_reconstructs_valid_schedule(self):
        res = DPChargingOptimizer.optimize_charging_schedule(
            self.corridor_nodes, self.segments, self.ev, max_trip_time_hours=18.5
        )
        self.assertTrue(res["feasible"])
        self.assertEqual(res["status"], "OPTIMAL")
        self.assertGreaterEqual(res["final_arrival_soc_kwh"], self.ev.min_reserve_kwh)
        for stop in res["charging_stops"]:
            self.assertGreater(stop.charged_kwh, 0)
            self.assertLessEqual(stop.departure_soc_kwh, self.ev.battery_capacity_kwh)


if __name__ == "__main__":
    unittest.main()
