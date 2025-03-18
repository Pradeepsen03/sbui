import { v4 as uuid } from 'uuid';

export const DashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/',
		role: ["ADMIN", "ACC"]
	},
	{
		id: uuid(),
		title: 'LAYOUTS & PAGES',
		grouptitle: true,
		role: [ "USER"]
	},
	{
		id: uuid(),
		title: 'Video Production Manager',
		grouptitle: true,
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Vdashboard',
		icon: 'layout',
		link: '/vdashboard',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Project',
		icon: 'layout',
		link: '/projects',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Client',
		icon: 'layout',
		link: '/client',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'CallSheet',
		icon: 'layout',
		link: '/callsheet',
		role: [ "ADMIN"]
	},	
	{
		id: uuid(),
		title: 'Layouts',
		icon: 'layout',
		link: '/layout-vertical',
		role: [ "USER"]
	},	

];

export default DashboardMenu;