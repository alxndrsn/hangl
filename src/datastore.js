const KEY_PARAMS = 'params';

const loadParams = () => {
  try {
    JSON.parse(localStorage.getItem(KEY_PARAMS));
  } catch(err) {
    console.log('datastore.loadParams()', 'caught error:', err);
  }
};

const saveParams = params => {
  localStorage.setItem(KEY_PARAMS, JSON.stringify(params));
};

const datastore = { loadParams, saveParams };
export default datastore;
