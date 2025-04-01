import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const Home = () => {
  return (
    <Card sx={{ width: 300, margin: "auto", mt: 10, p: 3, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5">Hi</Typography>
      </CardContent>
    </Card>
  );
};

export default Home;
