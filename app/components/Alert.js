import { AlertCircle, Mail } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

function AlertDestructive({ message, variant }) {
    return (
        <div className="p-2">
            <Alert variant={variant} className='absolute top-0 left-0 right-0 ml-auto mr-auto  md:max-w-fit md:min-w-60'>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </div>
    )
}

function AlertRegisterSuccess({ message }) {
    return (
        <div className="p-2">
            <Alert variant='' className='bg-green-300 absolute top-0 left-0 right-0 ml-auto mr-auto  md:max-w-fit md:min-w-60'>
                <Mail className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </div>
    )
}

module.exports = { AlertDestructive, AlertRegisterSuccess };