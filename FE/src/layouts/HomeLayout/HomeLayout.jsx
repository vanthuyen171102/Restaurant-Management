import { Footer, Header } from "../../components/Home";

function HomeLayout({children}) {
    return (
        <>  
        <Header />
        {children}
        <Footer />
        </>
    );
}

export default HomeLayout;