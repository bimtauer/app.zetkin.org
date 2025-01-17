module.exports = {
    async redirects() {
        return [
            {
                source: '/:prevPath*/calendar/events',
                destination: '/:prevPath*/calendar',
                permanent: false,
            },
            {
                source: '/:prevPath*/calendar/tasks',
                destination: '/:prevPath*/calendar',
                permanent: false,
            },
            // redirects to Gen2 for MVP August 2021
            {
                source: '/organize/:orgId(\\d{1,})',
                destination: 'https://organize.zetk.in/?org=:orgId',
                permanent: false,
            },
            {
                source: '/organize/:orgId(\\d{1,})/areas',
                destination: 'https://organize.zetk.in/maps?org=:orgId',
                permanent: false,
            },
            {
                source: '/organize/:orgId(\\d{1,})/campaigns/calendar/events/:eventId(\\d{1,})',
                destination: 'https://organize.zetk.in/campaign/action%3A:eventId?org=:orgId',
                permanent: false,
            },
            {
                source: '/organize/:orgId(\\d{1,})/campaigns/:campId(\\d{1,})/calendar/events/:eventId(\\d{1,})',
                destination: 'https://organize.zetk.in/campaign/action%3A:eventId?org=:orgId',
                permanent: false,
            },
            // all paths with /o redirected to Gen2
            {
                source: '/o/:path*',
                destination: 'https://zetk.in/o/:path*',
                permanent: false,
            },
        ]
    },
};
