interface Window {
    _AMapSecurityConfig: {
        securityJsCode: string
    }
}

type QCTYPE = {
    Login: {
        check(): boolean
        getMe(callback: (openId: string) => void): void
    }
}

declare const QC: QCTYPE