"use client";
import ProjectNavbar from "@/app/(main)/_components/ProjectNavbar";
import ProjectOverviewAndEpics from "@/app/(main)/_components/ProjectOverviewAndEpics";
import WriteProjectInfo from "@/app/(main)/_components/WriteProjectInfo";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Spinner from "@/components/ui/spinner";
import { getProjectById } from "@/convex/projects";

// interface ProjectIdPageProps {
//   params: {
//     projectId: Id<"projects">;
//   };
// }

const ProjectIdPage = ({ id }: { id: string }) => {
  // const id = params.projectId;

  // const {projectId} = params
  const [ProjectOverViewStep, setProjectOverViewStep] = useState(1);
  const project = useQuery(api.projects.getProjects, {
    id
  });

  if (project === undefined) {
    return <div className="flex justify-center items-center mx-auto"><Spinner/></div>;
  }

  if (project instanceof Error) {
    return <div>Error: {project.message}</div>;
  }
  console.log(project)

  return (
    <div className="pb-40">
      <div className="min-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
        <ProjectNavbar />
        <div className="pl-[96px] ">
          {ProjectOverViewStep === 1 && (
            <ProjectOverviewAndEpics project={project} setProjectOverViewStep={setProjectOverViewStep} />
          )}
          {ProjectOverViewStep === 2 && <WriteProjectInfo />}
        </div>
      </div>
    </div>
  );
};

export default ProjectIdPage;


export async function getServerSideProps(context: { params: { id: string }}) {
  return {
    props: {
      id: context.params.id,
    },
  };
}