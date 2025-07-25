import { Github, Heart, Kanban, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="max-w-7xl flex flex-col justify-between mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold">KanbanFlow</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Streamline your workflow with our powerful Kanban board solution.
              Organize tasks, collaborate with teams, and boost productivity.
            </p>
          </div>

          <div className=" w-full">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="flex flex-col gap-2 justify-between items-start w-full">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Board Creations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Archive Files
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  User Specific Role Access
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Real Time Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 KanbanFlow. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-2">Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current mr-2" />
              <span className="text-gray-400 text-sm">By Varun Balbudhe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
