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
		title: 'Projects',
		icon: 'layout',
		link: '/projects',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Clients',
		icon: 'layout',
		link: '/client',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'CallSheets',
		icon: 'layout',
		link: '/callsheet',
		role: [ "ADMIN"]
	},	
	{
		id: uuid(),
		title: 'Crew Members',
		icon: 'layout',
		link: '/crewMember',
		role: [ "ADMIN"]
	}	

];

export default DashboardMenu;