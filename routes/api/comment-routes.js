const router = require("express").Router();
const {
   addComment,
   removeComment,
   addReply,
   removeReply,
} = require("../../controllers/comment-controller");

// /api/comments/<pizzaId>
router.route("/:pizzaId").post(addComment);
// route method for deleting reply's
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

// /api/comments/<pizzaId>/<commentId>
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

module.exports = router;
