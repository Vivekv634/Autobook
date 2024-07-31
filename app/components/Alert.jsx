import { AlertCircle, Mail } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

function AlertDestructive({ message }) {
    return (
        <div className="p-2">
            <Alert variant='destructive' className='bg-red-300 absolute top-0 left-0 right-0 ml-auto mr-auto  md:max-w-fit md:min-w-60'>
                <AlertCircle className="h-5 w-5" />
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
            <Alert className='bg-green-300 absolute top-0 left-0 right-0 ml-auto mr-auto  md:max-w-fit md:min-w-60'>
                <Mail className="h-5 w-5" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </div>
    )
}

module.exports = { AlertDestructive, AlertRegisterSuccess };