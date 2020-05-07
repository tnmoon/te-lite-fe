import layoutFooterAside from '../layout/footer-aside'

export default [
  {
    path: '/',
    redirect: { name: 'document' },
    component: layoutFooterAside,
    children: [
      {
        path: 'document',
        name: 'document',
        component: require('../views/document').default
      },
      {
        path: 'expression',
        name: 'expression',
        component: require('../views/expression').default
      }
    ]
  }
]
