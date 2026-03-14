import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  publicKey: (process.env.CASDOOR_PUBLIC_KEY || '').replace(/\\n/g, '\n') || `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAta0Y1GyUMXlI6MOBvhCA
Vyl3QAkjbJxFm30D3O7d25GRLrop9GqFLExiMFxNC591zIDMglW5sKRc8wAoNOS8
QTfHWFB22UmTuz9HhOvWqqDM5d+6I3nZXHQJDS3+Mrq/QReZOCH0Lgd8ktZ9fkUP
cL6HW4GJ6vbbHFRpUmn0p3gmzvV8svE12HkyXkR7p8tu6sYpHQw1wjegdsqStvEd
f7ExZ0JZnhUTgjKLHZZN08Mnt5kLHmXQHjdLP6LdEU9wL+Wp0B0XJVvELw2G+gOX
BvJcO3C2L9j4WNHQKFfk9Zpehzo+s222khmp8t9n9kOeRtAZ3OXzMaWttjpoght4
R8fHU7jS0OOYHA7kUsUyj4cJhz0yPLvxkhvy8l5NnAuNElAG6dBWf+a9PeUPMEUo
5x9yeMS0lmJhrv6MO7srqswKoivi48NN7JNc4eNmxnOYwhvSQxrzujWTvA2rr8Jc
g6Y9rOiy+qipkuRu52FyfkR5qxYEJZp+L4m+qgXEoC8ujBIMvYJ++4zFLdshfdBn
iaKrNu8cXE72ousZQLSQF22qApCWufWFgJ8rQX/XiRC/lYNQuQ/LHIVjxA0b07id
wFLsGL19tPEzatR0ZFofwIDNswjlF3p97KByV6FbOG0QVGQLQcLNDJaZH3znnMyB
bGUZmpRXRxKlZzOypk4WzJcCAwEAAQ==
-----END PUBLIC KEY-----`,
  issuer: 'http://localhost:8000',
}));
