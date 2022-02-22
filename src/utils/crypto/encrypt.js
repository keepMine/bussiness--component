const CryptoJS = require('crypto-js');

/**
 * 加密
 * @param {*} key1  key
 * @param {*} iv1  iv
 * @param {*} data  加密字段
 * @returns  加密字段
 */
export const des_encrypt = function (key1, iv1, data) {
  const key = CryptoJS.MD5(key1).toString();
  const iv = CryptoJS.MD5(iv1).toString();
  // 将 key 和 偏移量 都转换为 二进制 byte字节，偏移量取前八位
  const crypto_key = CryptoJS.enc.Utf8.parse(key1);
  const crypto_iv = CryptoJS.enc.Utf8.parse(iv1.substr(0, 8));
  // 通过3des加密， CBC模式
  const encode_str = CryptoJS.TripleDES.encrypt(data, crypto_key, {
    iv: crypto_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encode_str.toString();
};

/**
 * 解密
 * @param {*} str  加密字段
 * @param {*} key1  加密key
 * @param {*} iv1  加密iv
 * @returns 解密字段
 */
export const des_decrypt = function (str, key1, iv1) {
   const key = CryptoJS.MD5(key1).toString();
   const iv = CryptoJS.MD5(iv1).toString();
  const crypto_key = CryptoJS.enc.Utf8.parse(key1);
  const crypto_iv = CryptoJS.enc.Utf8.parse(iv1.substr(0, 8));
  const decrypt_str = CryptoJS.TripleDES.decrypt(str, crypto_key, {
    iv: crypto_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypt_str.toString(CryptoJS.enc.Utf8);
};
