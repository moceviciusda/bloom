const MatrixPage = ({
  params,
}: {
  params: { organizationSlug: string; matrixSlug: string };
}) => {
  return (
    <div>
      <h1>Matrix Page</h1>
      <p>Organization: {params.organizationSlug}</p>
      <p>Matrix: {params.matrixSlug}</p>
    </div>
  );
};

export default MatrixPage;
