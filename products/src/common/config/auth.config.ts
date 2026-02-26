import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA/Wx2G7qDKuLhtvJTHSpH
jriO4/PUZUqG+jxOh6ECpbtfElnMJSNZ63aBFpLUi9ChKuSFtRMGifnXUfUXj0VD
BL9Kf7uiyv5C+RXBJ8J/F4qMiB6j5FTL/tQWxsGQSnMfVDXMBIoL2kDn8ka5Ps7p
RUh/UQCBoGhVcSsfeM5CPjyDM4GiDJcOvZ3IKBKWYKfAjSeLgdvjN18JOzFf1Un6
QEefUyKBuhkUfgAnbuJ1S3DDscmmqmJyCYG/etInUo5I0CGID3+AE2Lw4Ehu/HbF
Q1NRHM3WZRmP6QaCcAw9mdJmOkgTRrobyP6hyfd14uQ6UAz53qV9EmvoAFOPo8qV
LaG4EyGN1cJWvbAJSTRynAbE7tKYXGas65wl56u/gzTnqZyMWbe0lVi+q+pjgaJF
Jxw06+7iDIRuH6HJPHLzvRSJ1SVIVpt/pXutqyfgpdIuvNIrGP6WwhXq5fkJmrtA
PMr9Zg89y8WSaXuePNTwkN4Q92Dbn2JgV6DVl4pZ3qulzxX09m1ZUHXQZBwK794x
0IiMeFbYA9vjVSIWjrAcspB8B/d89gMqwL0KgdvNjVRKjXG2oZUjxq2mtfQRhAU7
wwwokGY6A+zCUcFCf5QQ6TIMwpwCwjBIgWf5kSd+vRcI96gakh8KJm6m/ds62HLC
0zR3oCHmkm+8peQLB40dcP0CAwEAAQ==
-----END PUBLIC KEY-----`,
  issuer: 'http://localhost:8000/casbin/app-built-in',
}));
