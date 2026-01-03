import { redirect } from "next/navigation";

const HomePage = ({ params }) => {
  redirect(`/admin/dashboard/`);
};

export default HomePage;
