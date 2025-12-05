import { TabView, TabPanel } from "primereact/tabview";
import DepreciationHistory from "./tables/DepreciationHistoryTable.js";
import FixedAssetsTable from "./tables/FixedAssetsTable.js";
export const AssetsManagementTabs = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Activos Fijos",
    leftIcon: "pi pi-box mr-2"
  }, /*#__PURE__*/React.createElement(FixedAssetsTable, null)), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Historial Depreciaci\xF3n",
    leftIcon: "pi pi-chart-line mr-2"
  }, /*#__PURE__*/React.createElement(DepreciationHistory, null))));
};
export default AssetsManagementTabs;