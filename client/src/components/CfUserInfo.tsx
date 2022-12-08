import { Link } from "@mui/material";
import { CfUser } from "types";

type CfUserInfoProps = {
  userInfo: any;
};

export const CfUserInfo = (props: CfUserInfoProps) => {
  const userInfo = props.userInfo;

  const getUserName = (userInfo: CfUser) => {
    const firstName = userInfo.firstName ?? "";
    const lastName = userInfo.lastName ?? "";

    if (firstName.length === 0) return "";
    if (lastName.length === 0) return firstName;
    return `${firstName} ${lastName}`;
  };

  const userName = getUserName(userInfo);
  const link = `https://codeforces.com/profile/${userInfo.handle}`;

  return (
    <>
      <p>
        Current Codeforces handle:{" "}
        <Link href={link} target="_blank" rel="noopener">
          <b>
            <RatingColoredString
              text={userInfo.handle}
              rating={userInfo.rating}
              colorFirstLetter
            />
          </b>
        </Link>{" "}
      </p>
      {userName.length !== 0 ? <p>Name: {userName}</p> : null}
      {userInfo.rating != undefined ? (
        <p>
          Rating:{" "}
          <RatingColoredString
            text={userInfo.rating.toString()}
            rating={userInfo.rating}
          />{" "}
          (max{" "}
          <RatingColoredString
            text={userInfo.maxRating.toString()}
            rating={userInfo.maxRating}
          />
          )
        </p>
      ) : null}
    </>
  );
};

type RatingColoredStringProps = {
  text: string;
  rating?: number;
  colorFirstLetter?: boolean;
};

const RatingColoredString = (props: RatingColoredStringProps) => {
  const { text, rating, colorFirstLetter } = props;

  const color = getRatingColor(rating);
  const firstLetterColor =
    colorFirstLetter && typeof rating === "number" && rating > 3000
      ? "#000000"
      : color;
  return (
    <>
      <span style={{ color: firstLetterColor }}>{text[0]}</span>
      <span style={{ color: color }}>{text.slice(1)}</span>
    </>
  );
};

const getRatingColor = (rating?: number) => {
  if (typeof rating !== "number") return "#000000";
  if (rating > 3000) return "#ff0000"; // Legendary Grandmaster
  else if (rating > 2600) return "#ff0000"; // International Grandmaster
  else if (rating > 2400) return "#ff0000"; // Grandmaster
  else if (rating > 2300) return "#ff8c00"; // International Master
  else if (rating > 2100) return "#ff8c00"; // Master
  else if (rating > 1900) return "#aa00aa"; // Candidate Master
  else if (rating > 1600) return "#0000ff"; // Expert
  else if (rating > 1400) return "#03a89e"; // Specialist
  else if (rating > 1200) return "#008000"; // Pupil
  return "#808080"; // Newbie
};
