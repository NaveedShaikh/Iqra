"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function YourTurn({ open,handleSubmit }: { open: boolean,handleSubmit:() => void; }) {

    return (
        <div className={`fixed  h-[100vh] w-[100vw] top-0 left-0 right-0 bottom-0 overflow-auto ${!open && 'hidden'} z-[100000] bg-black/20`}>
            <div className="bg-gray-100 p-4 mt-20">
                <Card className="max-w-2xl mx-auto border-none rounded-md">
                    <CardHeader className="bg-blue-500 text-white text-center rounded-t-md">
                        <CardTitle className="text-2xl font-bold">Are Your Ready For Interview ?</CardTitle>

                    </CardHeader>
                    <CardContent className="space-y-6 p-6">

                        <p className=" mt-2 text-center">
                            Please review the candidate's strengths and weaknesses and provide a brief comment before proceeding.
                        </p>
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-end pt-4" onClick={handleSubmit}>
                            <Button className="bg-themePrimary hover:bg-themePrimary text-white">Join Meeting</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

