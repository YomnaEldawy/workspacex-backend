const express = require("express");
const router = express.Router();
const executeQuery = require("../config/db");

router.get("/reports/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var result = await executeQuery(
    `select customerId, firstName, lastName, issuedAt, reportDescription from liveReports,Customer,reportTypes where workspaceId = ${wsId} AND liveReports.customerId = Customer.id AND reportTypes.reportId = liveReports.reportType;`
  );

  return res.send(result);
});
router.get("/reviews/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var result = await executeQuery(
    `select customerId, firstName, lastName, starRating, comment from Reviews,Customer where workspaceId = ${wsId} and Customer.id = Reviews.customerId;`
  );
  return res.send(result);
});

router.get("/reviews-by-count/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var result = await executeQuery(
    `SELECT 
        reportType, COUNT(reportType) as count, workspaceId, reportDescription, max(issuedAt)
    FROM
        liveReports,
        reportTypes
    WHERE
        workspaceId = '${wsId}'
            AND liveReports.reportType = reportTypes.reportId
            AND {fn TIMESTAMPDIFF(SQL_TSI_MINUTE,issuedAt, current_timestamp)} < 120
    GROUP BY liveReports.workspaceId , liveReports.reportType;`
  );
  return res.send(result);
});

router.get("/events/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var result = await executeQuery(
    `select eventName, version, startsAt, endsAt, description, fees from events where workspaceId = ${wsId};`
  );
  return res.send(result);
});
router.get("/amenities/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var result = await executeQuery(
    `select roomId, numberOfAmenities, amenityName, iconUrl from workspaceAmenities, amenities where workspaceId = ${wsId} and amenities.amenityId = workspaceAmenities.amenityId ;`
  );
  return res.send(result);
});
router.get("/room/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  const roomId = req.params.roomId;
  var result = await executeQuery(
    `select roomId, pricePerHour, pricePerDay, description, seatsNumber from workspaceRoom where workspaceId = ${wsId};`
  );
  return res.send(result);
});
router.get("/photos/:workspaceId", async (req, res) => {
  const wsId = req.params.workspaceId;
  var result = await executeQuery(
    `select photoId, photoUrl, description from workspacePhotos where workspaceId = ${wsId};`
  );
  return res.send(result);
});
module.exports = router;
