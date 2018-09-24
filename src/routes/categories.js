export default [
    {
        path : '/categories/',
        component : () => import(/* webpackChunkName: "category_chunck" */ '@/apps/categories/App.vue'),
        children : [
            {
                path : ':id(\\d+)',
                components : {
                    CategoryContent : () => import(/* webpackChunkName: "category_chunck" */ '@/apps/categories/CategoryRead.vue')
                },
                name : 'categories.read',
                props : {
                    CategoryComponent : true
                }
            },
            {
                path : '',
                components : {
                    CategoryContent : () => import(/* webpackChunkName: "category_chunck" */ '@/apps/categories/CategoryBrowse.vue')
                },
                name : 'categories.browse'
            }
        ]
    },
    {
        path : '/categories/create',
        component : () => import(/* webpackChunkName: "category_admin" */ '@/apps/categories/CategoryForm.vue'),
        name : 'categories.create'
    },
    {
        path : '/categories/update/:id(\\d+)',
        component : () => import(/* webpackChunkName: "category_admin" */ '@/apps/categories/CategoryForm.vue'),
        name : 'categories.update'
    }
];
