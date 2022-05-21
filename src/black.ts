const data = {
  user: 'AKhoi',
  key: 't?YE0QcS>P[rVgSXjWe5ywQ;Z:M;$K4ef{XbYw]5s0w;YVg#0-1(}`@hnjm5j{G'
}

const validate = (input: string) => input === data.key ? data.user : '';

export default validate;