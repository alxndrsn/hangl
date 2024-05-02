import { useNavigate } from 'react-router-dom';

const withRouter = Component => {
  return props => {
    const navigate = useNavigate();

    return (
      <Component
        navigate={navigate}
        {...props}
      />
    );
  };
};

export default withRouter;
