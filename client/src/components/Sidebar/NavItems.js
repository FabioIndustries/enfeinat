const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Home',
    to: '/home',
    icon: 'cil-home',
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Looking for Job']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Offers',
    to: '/offers',
    icon: 'cil-briefcase',
    badge: {
      color: 'danger',
      text: '230',
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Looking for Employees']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Candidates',
    route: '/candidates',
    to: '/candidates',
    icon: 'cil-people',
    badge: {
      color: 'danger',
      text: '59',
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Enfeina\'t'],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Contact',
    route: '/contact',
    to: '/contact',
    icon: 'cil-send',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['User zone'],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Login',
    route: '/login',
    to: '/login',
    icon: 'cil-lock-locked',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Sign up',
    route: '/signup',
    to: '/signup',
    icon: 'cil-user-plus',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Logout',
    route: '/logout',
    to: '/logout',
    icon: 'cil-exit-to-app',
  },
  
]

export default _nav
