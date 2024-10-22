const Bubbles = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bubble"></div>
    ))}
  </>
);

export { Bubbles };
