 export async function getServerSideProps(context) {
  const { id } = context.query;
  console.log({ id });
  return {
    props: {
      id,
    },
  };
}
const Video = ({ id }) => {
  return <div>{id}</div>;
};

export default Video;
