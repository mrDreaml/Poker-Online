const images = {};

{ function importAll(r) {
  return r.keys().forEach((key) => {
    images[key.replace(/.\//, '').replace(/.svg/, '')] = r(key);
  });
}

importAll(require.context('./', false, /\.(svg)$/)); }

export default images;
