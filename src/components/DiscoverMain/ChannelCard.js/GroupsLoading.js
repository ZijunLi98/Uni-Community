import styles from "./GroupsLoading.module.scss";

function GroupsLoading() {
  const LoadingElement = Array.apply(null, { length: 10 }).map((e, i) => (
    <div key={i} className={styles.cardContainer} />
  ));
  return <>{LoadingElement}</>;
}

export default GroupsLoading;
