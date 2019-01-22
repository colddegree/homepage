import "bootstrap";
import moment from "moment";
import initNavbar from "./header";
import Router from "./router";


moment.locale("ru");
initNavbar();
Router.load();
