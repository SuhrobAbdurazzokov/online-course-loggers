import { hash, compare } from "bcrypt";

class Crypto {
    async encrypt(data) {
        return hash(data, 8);
    }

    async decrypt(data, encryptedData) {
        return compare(data, encryptedData);
    }
}

export default new Crypto();
