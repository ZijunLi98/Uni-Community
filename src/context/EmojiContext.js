import React from "react";

export const EmojisContext = React.createContext({
  emojis: {},
  convertEmojis: () => {},
  counter: 0,
});

let counter;
function importAll(r) {
  let images = {};
  counter = 0;
  r.keys().forEach((item) => {
    images[counter] = { src: r(item), stringCode: `[${counter}]` };
    counter++;
  });
  return images;
}

const emojis = importAll(
  require.context("../assets/emojis", false, /\.(PNG|png|jpe?g|svg)$/)
);

//Input: const paragraph = "interesting more [1]communities out here![2]";
export const convertEmojis = (paragraph) => {
  let output = [];
  // 拿到emoji对应的key
  const emojiStr = paragraph
    .match(/\[\d+\]/g)
    ?.map((match) => match.replace(/[^\d]/g, ""));
  // 拿到去除emoji string的段落
  const newPara = paragraph.split(/\[\d+\]/g);

  const emojiImgs = emojiStr?.map((el) => {
    return (
      <img
        src={emojis[el].src}
        alt=""
        style={{
          width: "36px",
          height: "auto",
        }}
      />
    );
  });

  for (let i = 0; i < newPara.length; i++) {
    output.push(newPara[i]);
    if (emojiStr !== undefined && i < newPara.length) {
      output.push(emojiImgs[i]);
    }
  }
  return output;
};

const EmojisProvider = (props) => {
  return (
    <EmojisContext.Provider
      value={{
        emojis,
        convertEmojis,
        counter,
      }}
    >
      {props.children}
    </EmojisContext.Provider>
  );
};

export default EmojisProvider;
