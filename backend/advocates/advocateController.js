const {
  getAdvocates,
  getAvailableCounties,
  getAvailableNeeds,
  searchAdvocates
} = require("./advocateStore");

function getAllAdvocates(_req, res) {
  res.json({
    advocates: getAdvocates(),
    counties: getAvailableCounties(),
    needs: getAvailableNeeds()
  });
}

function postAdvocateSearch(req, res) {
  const { city = "", county = "", need = "" } = req.body || {};

  res.json({
    advocates: searchAdvocates({ city, county, need }),
    counties: getAvailableCounties(),
    needs: getAvailableNeeds()
  });
}

module.exports = {
  getAllAdvocates,
  postAdvocateSearch
};
