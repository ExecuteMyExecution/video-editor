import Home from '@/pages/Home';
import Editor from '@/pages/Editor';
import Caption from '@/pages/Editor/pages/Caption';
import Image from '@/pages/Editor/pages/Image';

export default [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/editor',
        component: Editor,
        children: [
            {
                path: '/editor/caption',
                component: Caption
            },
            {
                path: '/editor/image',
                component: Image
            }
        ]
    }
]