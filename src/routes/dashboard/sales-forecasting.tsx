import { createFileRoute } from "@tanstack/react-router";
import SalesForecastingDashboard from "@/components/sales-forecasting-dashboard";

export const Route = createFileRoute("/dashboard/sales-forecasting")({
  component: SalesForecastingDashboard,
});
