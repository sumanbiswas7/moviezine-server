const { db } = require("../database/database");
const { queries } = require("../database/queries");
const moment = require("moment");

const resolvers = {
  Query: {
    getmovies: async () => {
      const res = await db.query(queries.getmovies);
      return res.rows;
    },
    getusers: async () => {
      const res = await db.query(queries.getusers);
      return res.rows;
    },
    movies: async () => {
      const res = await db.query(queries.movies);
      return res.rows;
    },
    likes: async () => {
      const res = await db.query(queries.likes);
      return res.rows;
    },
    comments: async (parent, args, ctx) => {
      const movieId = args.movieId;
      const res = await db.query(queries.comment.comments, [movieId]);
      return res.rows;
    },
  },
  Mutation: {
    addMovie: async (parents, args, ctx) => {
      const data = args.movie;
      await db.query(queries.addmovie, [
        data.movie_name,
        data.movie_director,
        data.movie_release,
        data.movie_image,
        data.movie_description,
        data.movie_type,
        data.movie_rating,
        data.movie_casts,
        data.movie_fk,
      ]);
      return "Movie added";
    },

    addUser: async (parents, args, ctx) => {
      const data = args.user;

      await db.query(queries.adduser, [
        data.user_name,
        data.user_password,
        data.user_email,
        data.user_profile,
        data.user_country,
      ]);

      return "User added";
    },
    updateUser: async (parents, args, ctx) => {
      const data = args.user;

      await db.query(queries.updateuser, [
        data.user_name,
        data.user_email,
        data.user_country,
        data.user_profile,
        data.ID,
      ]);

      return "User updated";
    },

    updateMovie: async (parents, args, ctx) => {
      const data = args.movie;
      await db.query(queries.updatemovie, [
        data.movie_name,
        data.movie_director,
        data.movie_release,
        data.movie_image,
        data.movie_description,
        data.movie_type,
        data.movie_rating,
        data.movie_casts,
        data.ID,
      ]);
      return "Movie updated";
    },

    deleteMovie: async (parents, args, ctx) => {
      const movie_id = args.movieId;
      await db.query(queries.deletemovie, [movie_id]);
      return "Movie deleted";
    },

    likeMovie: async (parent, args, ctx) => {
      const { movie_id, user_id, likeCount } = args.likeData;
      const isLikeExist = await db.query(queries.like.ifLikeExist, [
        user_id,
        movie_id,
      ]);
      if (isLikeExist.rows.length > 0) {
        await db.query(queries.like.delete, [movie_id, user_id]);
        await db.query(queries.like.movieCount, [likeCount - 1, movie_id]);

        return `Liked deleted UID - ${user_id}, MID - ${movie_id}`;
      } else {
        const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
        await db.query(queries.like.addLike, [movie_id, user_id, timestamp]);
        await db.query(queries.like.movieCount, [likeCount + 1, movie_id]);

        return `Liked added MID - ${movie_id} UID - ${user_id}`;
      }
    },

    addComment: async (parent, args, ctx) => {
      const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      const data = args.commentInput;

      await db.query(queries.comment.movieCount, [
        data.comment_count + 1,
        data.comment_movie_fk,
      ]);
      await db.query(queries.comment.addComment, [
        data.comment_movie_fk,
        data.comment_user_fk,
        data.comment_text,
        timestamp,
      ]);

      return `Comment added`;
    },
  },
};

module.exports = { resolvers };
