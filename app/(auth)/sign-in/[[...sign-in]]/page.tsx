import { SignIn } from "@clerk/nextjs";

const page = () => {
    return (
        <div className="bg-gray-900 h-screen flex
         justify-center items-center">
            <SignIn />
        </div>
    )
};

export default page;