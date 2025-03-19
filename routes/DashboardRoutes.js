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
		icon: 'layers',
		link: '/vdashboard',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Projects',
		icon: 'folder',
		link: '/projects',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Clients',
		icon: 'user-plus',
		link: '/client',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'CallSheets',
		icon: 'phone',
		link: '/callsheet',
		role: [ "ADMIN"]
	},	
	{
		id: uuid(),
		title: 'Crew Members',
		icon: 'users',
		link: '/crewMember',
		role: [ "ADMIN"]
	},
	{
		id: uuid(),
		title: 'Equipments',
		icon: 'camera ',
		link: '/equipments',
		role: [ "ADMIN"]
	}		

];

export default DashboardMenu;