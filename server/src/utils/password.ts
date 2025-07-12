export class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password)
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return Bun.password.verify(password, hash)
  }

  static validatePasswordStrength(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }
}
