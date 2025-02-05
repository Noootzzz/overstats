import PropTypes from 'prop-types';

const PlayerPage = ({ playerData }) => {
  if (!playerData) {
    return (
      <div className="container mx-auto px-4 mt-8 text-center text-red-500">
        go back and search for a player
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
        <div className="mt-6 w-3/4">
          <h2 className="text-xl font-semibold mb-3">Detailed Player Stats</h2>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(playerData, null, 2)}
          </pre>
        </div>
      </div>

  );
};

PlayerPage.propTypes = {
  playerData: PropTypes.shape({
    username: PropTypes.string,
    career: PropTypes.shape({
      level: PropTypes.number,
    }),
    region: PropTypes.string,
    platform: PropTypes.string,
    competitive: PropTypes.shape({
      pc: PropTypes.shape({
        tank: PropTypes.shape({
          division: PropTypes.string,
        }),
        damage: PropTypes.shape({
          division: PropTypes.string,
        }),
        support: PropTypes.shape({
          division: PropTypes.string,
        }),
      }),
    }),
  }),
};

export default PlayerPage;