import React from 'react';
import {Routes, Route} from "react-router-dom";
import routingList from "./RoutingList.jsx";

const Routing = () => {
	return (
		<Routes>
			{
				routingList.map((item) => (
					<>
						<Route path={item.path} element={<item.component/>}/>
					</>
				))
			}
		</Routes>
	);
};

export default Routing;