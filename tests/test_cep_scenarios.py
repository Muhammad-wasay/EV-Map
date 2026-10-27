import unittest
from src.pipeline import VoltPathPipeline


class TestDPAndCEPScenarios(unittest.TestCase):
    def setUp(self):
        self.pipeline = VoltPathPipeline(use_live_api=False)

    def test_primary_optimal_plan(self):
        plan = self.pipeline.run_trip_planner("N01", "N14", max_allowed_time_hours=18.5)
        self.assertEqual(plan.status, "OPTIMAL")
        self.assertGreater(len(plan.charging_stops), 0)
        self.assertLessEqual(plan.total_trip_time_hours, 18.5)
        self.assertGreaterEqual(plan.final_arrival_soc_kwh, 12)

    def test_edge_case_disconnected_graph(self):
        plan = self.pipeline.run_trip_planner(
            "N01", "N04", dataset_path="data/edge_case_disconnected.json"
        )
        self.assertEqual(plan.status, "INFEASIBLE_DISCONNECTED")
        self.assertGreater(len(plan.isolated_nodes), 0)

    def test_edge_case_deadzone(self):
        plan = self.pipeline.run_trip_planner(
            "N01", "N04", dataset_path="data/edge_case_deadzone.json"
        )
        self.assertEqual(plan.status, "INFEASIBLE_DEADZONE")

    def test_edge_case_tight_time_budget(self):
        plan = self.pipeline.run_trip_planner("N01", "N14", max_allowed_time_hours=11.0)
        self.assertEqual(plan.status, "FEASIBLE_TIME_WARNING")
        self.assertGreater(len(plan.charging_stops), 0)

    def test_api_fallback_graceful(self):
        api_pipeline = VoltPathPipeline(use_live_api=True)
        plan = api_pipeline.run_trip_planner("N01", "N14", max_allowed_time_hours=16.5)
        self.assertIn(plan.status, ["OPTIMAL", "FEASIBLE_TIME_WARNING"])


if __name__ == "__main__":
    unittest.main()
