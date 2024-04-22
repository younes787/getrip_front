import '../styles/loading.scss'

type Props = {
loading : boolean
}

const LoadingComponent = () => {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  };

  export default LoadingComponent;