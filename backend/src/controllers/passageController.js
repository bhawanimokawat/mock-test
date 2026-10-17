const {  getPublishedPassages,  getPassageById,} = require("../models/passageModel");

const listPassages = async (req, res, next) => {
    try {
        const passages = await getPublishedPassages();

        res.status(200).json({
            success: true,
            count: passages.length,
            passages,
        });
    } catch (error) {
        next(error);
    }
};

const getPassage = async (req, res, next) => {
    try {
        const passageId = Number(req.params.id);

        if (!Number.isSafeInteger(passageId) || passageId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid passage ID",
            });
        }

        const passage = await getPassageById(passageId);

        if (!passage) {
            return res.status(404).json({
                success: false,
                message: "Published passage not found",
            });
        }

        res.status(200).json({
            success: true,
            passage,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {  listPassages,  getPassage,};
