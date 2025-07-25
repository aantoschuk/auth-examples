export default () => ({
  port: process.env.PORT || 8000,
  database: {
    url: process.env.DATABASE_URL!,
    ssl: false,
  },
  secret: process.env.SECRET,
});
