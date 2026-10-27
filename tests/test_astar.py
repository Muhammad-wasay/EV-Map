import unittest
from src.api_client import VoltPathAPIClient
from src.astar_router import AStarRouter, haversine_km
from src.preprocessor import NetworkPreprocessor


class TestAStarRouter(unittest.TestCase):
    def setUp(self):
        client = VoltPathAPIClient()
        self.nodes, self.edges, self.ev, _ = client.load_network_and_ev()
        self.adj, self.excluded = NetworkPreprocessor.build_active_adjacency_list(
            self.nodes, self.edges
        )

    def test_blocked_roads_excluded(self):
        self.assertGreaterEqual(len(self.excluded), 2)
        for e in self.excluded:
            self.assertTrue(e.is_blocked)

    def test_haversine_admissibility(self):
        dest = self.nodes["N14"]
        path_nodes, path_edges, metrics = AStarRouter.find_optimal_route(
            self.nodes, self.adj, "N01", "N14"
        )
        self.assertIsNotNone(path_nodes)
        straight_line = haversine_km(
            self.nodes["N01"].lat, self.nodes["N01"].lon, dest.lat, dest.lon
        )
        self.assertLessEqual(straight_line, metrics["total_distance_km"])

    def test_incremental_route_repair(self):
        path_nodes, path_edges, _ = AStarRouter.find_optimal_route(
            self.nodes, self.adj, "N01", "N14"
        )
        res = AStarRouter.incremental_route_update(
            self.nodes, self.edges, path_nodes, path_edges, [("N08", "N10")]
        )
        self.assertTrue(res["recomputed"])
        self.assertIsNotNone(res["updated_path_nodes"])
        self.assertEqual(res["updated_path_nodes"][0], "N01")
        self.assertEqual(res["updated_path_nodes"][-1], "N14")


if __name__ == "__main__":
    unittest.main()
