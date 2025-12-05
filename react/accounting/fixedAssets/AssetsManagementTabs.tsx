import { TabView, TabPanel } from "primereact/tabview";
import DepreciationHistory from "./tables/DepreciationHistoryTable";
import FixedAssetsTable from "./tables/FixedAssetsTable";

export const AssetsManagementTabs = () => {
  return (
    <div className="container-fluid mt-4">
      <TabView>
        <TabPanel header="Activos Fijos" leftIcon="pi pi-box mr-2">
          <FixedAssetsTable />
        </TabPanel>
        <TabPanel
          header="Historial Depreciación"
          leftIcon="pi pi-chart-line mr-2"
        >
          <DepreciationHistory />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AssetsManagementTabs;
