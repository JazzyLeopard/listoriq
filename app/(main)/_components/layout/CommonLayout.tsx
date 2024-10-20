/**
 * v0 by Vercel.
 * @see https://v0.dev/t/39pYKzqyX3o
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import '@/app/custom.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from '@/convex/_generated/api';
import AiGenerationIconWhite from "@/icons/AI-Generation-White";
import type { MenuItemType, Project } from "@/lib/types";
import { useQuery } from 'convex/react';
import { Presentation, Rocket, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LabelToInput from "../LabelToInput";
import PresentationMode from '../PresentationMode';
import EditorList from "./EditorList";
import FieldList from "./FieldList";

interface CommonLayoutProps {
    data: Project;
    menu: MenuItemType[];
    onEditorBlur: () => Promise<void>;
    handleEditorChange: (attribute: string, value: any) => void,
    showTitle?: boolean;
    mandatoryFields?: string[];
}

const CommonLayout = ({
    data,
    menu,
    onEditorBlur,
    handleEditorChange,
    showTitle = true,
    mandatoryFields = ["overview", "problemStatement", "userPersonas", "featuresInOut"]
}: CommonLayoutProps) => {

    const [activeSection, setActiveSection] = useState<string>('');
    const [isPresentationMode, setIsPresentationMode] = useState(false);
    const [isBrainstormChatOpen, setIsBrainstormChatOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isGenerateButtonActive, setIsGenerateButtonActive] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isFrGenerated, setIsFrGenerated] = useState(false)
    const router = useRouter();

    useEffect(() => {
        if (!activeSection && menu.length > 0) {
            setActiveSection(menu[0].key);
        }
    }, [menu, activeSection]);

    useEffect(() => {
        // Check if all required fields have content
        const requiredFields = ["overview", "problemStatement", "userPersonas", "featuresInOut"];
        const allFieldsHaveContent = requiredFields.every(field => {
            const value = data[field];
            return value && typeof value === 'string' && value.trim() !== '';
        });
        setIsGenerateButtonActive(allFieldsHaveContent);
    }, [data]);

    // Check if the functional requirements are already generated
    const checkFunctionalRequirements = useQuery(api.functionalRequirements.getFunctionalRequirementsByProjectId, { projectId: data._id });

    useEffect(() => {
        if (checkFunctionalRequirements && checkFunctionalRequirements?.content) {
            setIsFrGenerated(true); // Disable button if already generated
        }
    }, [checkFunctionalRequirements]);

    const togglePresentationMode = () => {
        setIsPresentationMode(!isPresentationMode);
    };

    if (isPresentationMode) {
        return <PresentationMode data={data} onClose={() => setIsPresentationMode(false)} />;
    }

    // console.log("Current data in CommonLayout:", data);

    const handleGenerateFR = () => {
        setIsConfirmModalOpen(true);
    };

    const confirmGenerateFR = async () => {
        setIsConfirmModalOpen(false);

        try {
            // Navigate to the Functional Requirements page and trigger generation\
            await router.push(`/projects/${data._id}/functional-requirements?generate=true`);
        }
        catch (error) {
            console.log("Error routing", error)
        }
    };
    // console.log("Current data in CommonLayout:", data);

    return (
        <div className="h-screen flex flex-col z-top">
            {showAlert && (
                <Alert className="mt-16 ml-8 mr-8 bg-primary/5 w-4/4 text-primary relative">
                    <Rocket className="h-5 w-5" />
                    <AlertTitle className="text-md">Welcome!</AlertTitle>
                    <AlertDescription>
                        This is your PRD, your product/project requirements document. This is where all of the business information related to your product or project lives.<br />
                        This tool uses the information you specify here to help you create all the necessary parts of your analysis to have development-ready user stories.
                    </AlertDescription>
                    <Button
                        className="absolute top-2 right-2 p-1"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAlert(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            )}

            <div className="bg-white sticky z-999 flex items-center justify-between px-8 pt-8 pb-2">
                {showTitle && (
                    <div className="flex-1 mr-4">
                        <LabelToInput
                            value={data?.title}
                            setValue={(val) => handleEditorChange('title', val)}
                            onBlur={onEditorBlur}
                        />
                    </div>
                )}

                <div className="flex items-center gap-4 ml-auto">
                    <Button
                        className="gap-2"
                        onClick={handleGenerateFR}
                        disabled={!isGenerateButtonActive || isFrGenerated}
                    >
                        <AiGenerationIconWhite />
                        {isFrGenerated ? "Functional Requirements Generated" : "Generate Functional Requirements"}
                    </Button>
                    <Button
                        className="bg-white text-black border border-gray-300 hover:bg-gray-200"
                        onClick={togglePresentationMode}
                    >
                        <Presentation className="pr-2" />
                        Presentation Mode
                    </Button>
                </div>
            </div>

            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-2">Generate Functional Requirements</DialogTitle>
                        <DialogDescription className="pb-2">
                            Are you confident that you've provided enough information about the project to generate comprehensive Functional Requirements?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                        <Button onClick={confirmGenerateFR}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="overflow-hidden grid grid-cols-[250px,1fr] gap-8 px-8 pt-10 laptop-1024:overflow-auto">
                <div className="align-top">
                    <FieldList
                        components={menu}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        mandatoryFields={mandatoryFields}
                        projectId={data._id}
                    />
                </div>
                <div className="overflow-hidden">
                    <EditorList
                        components={menu.filter(c => c.key === activeSection)}
                        data={data}
                        handleEditorChange={handleEditorChange}
                        onEditorBlur={onEditorBlur}
                        onOpenBrainstormChat={async () => { }} />
                </div>
            </div>
        </div>
    );
};

export default CommonLayout;
