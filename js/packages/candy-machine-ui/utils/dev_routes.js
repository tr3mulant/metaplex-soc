export const DevRoutes = () => {
    if (process.env.NODE_ENV === "production") {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    return { props: {} };
};