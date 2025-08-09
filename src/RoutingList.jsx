import Pages from "./Pages/index.js";
import {Constants} from "./Constants.js";

export default [
	{
		path: "/",
		component: Pages.Home,
		type: Constants.WARE_HOUSE_ROUTING_TYPE
	},
	{
		path: "/receipt/form/:id",
		component: Pages.ReceiptForm,
		type: Constants.WARE_HOUSE_ROUTING_TYPE
	},
	{
		path: "/receipt/form",
		component: Pages.ReceiptForm,
		type: Constants.WARE_HOUSE_ROUTING_TYPE
	},
	{
		path: "/unit",
		component: Pages.UnitList,
		type: Constants.DIRECTORIES_ROUTING_TYPE
	},
	{
		path: "/resource",
		component: Pages.ResourceList,
		type: Constants.DIRECTORIES_ROUTING_TYPE
	},
]