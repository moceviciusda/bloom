const Dashboard = ({ params }: { params: { organizationSlug: string } }) => (
  <p>Dashboard for org {params.organizationSlug}</p>
);

export default Dashboard;
