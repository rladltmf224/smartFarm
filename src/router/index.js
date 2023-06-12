import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/Login"),
  },

  {
    path: "/",
    redirect: "login",
    name: "Layout",
    component: () => import("@/components/Layout/Layout"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/Home/Home"),
      },
      {
        path: "membermng",
        name: "Membermng",
        component: () => import("@/views/Member/MemberMng"),
      },
      {
        path: "customermng",
        name: "CustomerMng ",
        component: () => import("@/views/CustomerMng/CustomerMng"),
      },
      {
        path: "bom",
        name: "Bom ",
        component: () => import("@/views/Bom/Bom"),
      },
      {
        path: "storagemng",
        name: "StorageMng ",
        component: () => import("@/views/StorageMng/StorageMng"),
      },
      {
        path: "facilitymng",
        name: "Facilitymng ",
        component: () => import("@/views/Facilitymng/Facilitymng"),
      },
      {
        path: "operationOrder",
        name: "OperationOrder",
        component: () => import("@/views/OperationManagement/OperationOrder"),
      },
      {
        path: "itemmng",
        name: "ItemMng ",
        component: () => import("@/views/ItemMng/ItemMng"),
      },
      {
        path: "warehousingmng",
        name: "WarehousingMng ",
        component: () => import("@/views/WarehousingMng/WarehousingMng"),
      },
      {
        path: "releaseorder",
        name: "ReleaseOrder ",
        component: () => import("@/views/ReleaseOrder/ReleaseOrder"),
      },
      {
        path: "releaseproduct",
        name: "ReleaseProduct ",
        component: () => import("@/views/ReleaseProduct/ReleaseProduct"),
      },
      {
        path: "productwarehousing",
        name: "ProductWarehousing ",
        component: () =>
          import("@/views/ProductWarehousing/ProductWarehousing"),
      },
      {
        path: "productstock",
        name: "ProductStock ",
        component: () => import("@/views/ProductStock/ProductStock"),
      },

      {
        path: "rawmaterialstock",
        name: "RawmaterialStock ",
        component: () => import("@/views/RawmaterialStock/RawmaterialStock"),
      },

      {
        path: "lottracking",
        name: "LotTracking ",
        component: () => import("@/views/LotTracking/LotTracking"),
      },

      {
        path: "warehousingprice",
        name: "WarehousingPrice ",
        component: () => import("@/views/WarehousingPrice/WarehousingPrice"),
      },
      {
        path: "stock",
        name: "Stock ",
        component: () => import("@/views/Stock/Stock"),
      },

      {
        path: "MonitoringGraph",
        name: "MonitoringGraph",
        component: () => import("@/views/EnvironmentalControl/MonitoringGraph"),
      },

      {
        path: "TempHumid",
        name: "TempHumid",
        component: () => import("@/views/EnvironmentalControl/TempHumid"),
      },
      {
        path: "WaterpH",
        name: "WaterpH",
        component: () => import("@/views/EnvironmentalControl/WaterpH"),
      },

      {
        path: "InputData",
        name: "InputData",
        component: () => import("@/views/WaterpHEC/InputData"),
      },
      {
        path: "TableCard",
        name: "TableCard",
        component: () => import("@/views/Experiment/TableCard"),
      },

      {
        path: "Monitoring",
        name: "Monitoring",
        component: () => import("@/views/EnvironmentalControl/Monitoring"),
      },
      {
        path: "TemperatureHistory",
        name: "TemperatureHistory",
        component: () =>
          import("@/views/TemperatureHistory/TemperatureHistory"),
      },
      {
        path: "ShowControllHistory",
        name: "ShowControllHistory",
        component: () => import("@/views/ControllHistory/ShowControllHistory"),
      },
      {
        path: "ShowTest",
        name: "ShowTest",
        component: () => import("@/views/Experiment/ShowTest"),
      },
      {
        path: "ShowImage",
        name: "ShowImage",
        component: () => import("@/views/Experiment/ShowImage"),
      },
      {
        path: "ShowTestForm",
        name: "ShowTestForm",
        component: () => import("@/views/Experiment/ShowTestForm"),
        props: true,
      },
      {
        path: "OrderManagement",
        name: "OrderManagement",
        component: () => import("@/views/OrderManagement/OrderManagement"),
      },
      {
        path: "notdev",
        alias: ["barcodemng", "processmng", "qualitymng", "equipment"],
        name: "NotDev ",
        component: () => import("@/components/page/NotDev/NotDev"),
      },
      {
        path: "schedule",
        name: "Schedule ",
        component: () => import("@/views/Schedule/Schedule"),
      },
      {
        path: "AlarmHistory",
        name: "AlarmHistory ",
        component: () => import("@/views/AlarmHistory/AlarmHistory"),
      },
      {
        path: "calendar",
        name: "calendar ",
        component: () => import("@/views/ConsumerProduct/calendar"),
      },
      {
        path: "OperationOrderDetail",
        name: "OperationOrderDetail ",
        component: () =>
          import("@/views/OperationOrderDetailMng/OperationOrderDetail.vue"),
      },
      {
        path: "ManureMng",
        name: "ManureMng",
        component: () => import("@/views/WaterpHEC/ManureMng"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
