import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA7eOTNH7MOXO6yrXySrHv
aIBsN2fFdV490IEPFXcJNXr12+jUwA6mjngCBAR5+V3EdAcvb9Z8hfclpxT2XS4z
SNQShMVqSpsVBJs/92mKEaze1yWQJ0sbpp50/q1Z6JDtFvKRajxyK/RxC2VWqREP
72CtNTTgZeyC7WTAJCuKDK5w/vBbtm+AR9/YSke5ByU5LnmZ2aCk/RQyXkSwv5/Q
dwuhO168Bfm2/go2QNezlusagTHypksPAgZeQgWLS44umh4c6F4irkQdynzCtwMR
5t21Bv3xMFmrP7urIhmNBivlWNXibrFmBaejcfI3s4Rb89HCo77M9eLSVHakPpwn
JLQH98fjzBRfdlJViU9tA/7k78SsF15lKLJSyDm5bC/C1Iqi4CcbHn0A8j9YkDPY
bK81vZ2cTElvKTeVo/EYRgublVaAsA6q+ysnd1CTghZShyJAm0ObkCrh2lMzUqt9
oR2Wql+ALtMlqGUhAnAKxPOSM369ex0LapOiN4eYw39JnMSCyYextaGAGWZyu3yc
ltXqXAg3xAMnBReV/4jN4DU+IpgSR6aNQ/cvxuPF5GjeqbYQzDjIkkfwjYuxHWAJ
iDPsRPBwWD/Gjts9KHEdRvBruUgwv5rrmxBNPGmOV5m3sejo1C9tfDYV9XkfziOv
53uMLkxuuwTpu67EP9iO/sMCAwEAAQ==
-----END PUBLIC KEY-----`,
  issuer: 'http://localhost:8000',
}));
